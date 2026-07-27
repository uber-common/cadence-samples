from dataclasses import dataclass
import re
from textwrap import dedent

from agents import Agent, RunConfig, Runner, function_tool
import cadence

from research_tools import (
    log_research_progress,
    publish_research_report,
    read_research_source,
    search_research_sources,
)


workflow_registry = cadence.Registry()


@dataclass
class MarkdownQueryResponse:
    """Shape Cadence Web uses to render query results as Markdown."""

    cadenceResponseType: str
    format: str
    data: str


async def _research_question(question: str, run_config: RunConfig) -> str:
    researcher = Agent(
        name="Research Specialist",
        model="gpt-4o-mini",
        instructions=(
            "Research the exact question you receive. First call "
            "search_research_sources, then read the two most relevant results. "
            "Write a concise evidence-based summary with a heading that names the "
            "subject. Cite the simulated sources you read and clearly separate "
            "established knowledge from uncertain claims."
        ),
        tools=[
            function_tool(search_research_sources),
            function_tool(read_research_source),
        ],
    )
    result = await Runner.run(
        researcher,
        f"Research this question: {question}",
        run_config=run_config,
    )
    return str(result.final_output)


async def _synthesize_report(
    topic: str,
    summaries: list[str],
    run_config: RunConfig,
) -> str:
    synthesizer = Agent(
        name="Report Synthesizer",
        model="gpt-4o-mini",
        instructions=(
            "Write a clear Markdown research report in plain English. Include a "
            "title, Executive Summary, Key Findings, Cross-cutting Challenges, "
            "and Outlook. Create a clearly labeled Key Findings subsection for "
            "every research thread. Do not omit or silently merge a thread."
        ),
    )
    prompt = (
        f"Original research topic: {topic}\n\n"
        "Research summaries:\n\n" + "\n\n---\n\n".join(summaries)
    )
    result = await Runner.run(synthesizer, prompt, run_config=run_config)
    return str(result.final_output)


async def _edit_report(
    current_report: str,
    edit_request: str,
    run_config: RunConfig,
    new_research: str = "",
) -> str:
    editor = Agent(
        name="Report Editor",
        model="gpt-4o-mini",
        instructions=(
            "Edit the supplied report and return the complete updated Markdown "
            "report only. Preserve existing material unless the requested edit "
            "requires a change. If new research is supplied, add a substantive, "
            "clearly labeled section for its exact topic and update the Executive "
            "Summary and Outlook as appropriate."
        ),
    )
    prompt = f"Edit request:\n{edit_request}\n\nCurrent report:\n{current_report}"
    if new_research:
        prompt += f"\n\nNew research that must appear:\n{new_research}"
    result = await Runner.run(editor, prompt, run_config=run_config)
    return str(result.final_output)


@workflow_registry.workflow(name="AutoResearchWorkflow")
class AutoResearchWorkflow:
    def __init__(self) -> None:
        self._draft = ""
        self._review_decision: str | None = None
        self._review_round = 0
        self._status = "Waiting to start"

    @cadence.workflow.query(name="get_report_draft")
    def get_report_draft(self) -> MarkdownQueryResponse:
        info = cadence.workflow.WorkflowContext.get().info()
        return MarkdownQueryResponse(
            cadenceResponseType="formattedData",
            format="text/markdown",
            data=_render_report_review(
                status=self._status,
                draft=self._draft,
                review_round=self._review_round,
                domain=info.workflow_domain,
                workflow_id=info.workflow_id,
                run_id=info.workflow_run_id,
            ),
        )

    @cadence.workflow.signal(name="review_report")
    def review_report(self, decision: str) -> None:
        self._review_decision = decision.strip().strip('"')

    @cadence.workflow.run
    async def run(self, topic: str) -> str:
        run_config = RunConfig(tracing_disabled=True)
        self._status = "Planning research questions"
        await log_research_progress(f"Planning research for: {topic}")

        planner = Agent(
            name="Research Planner",
            model="gpt-4o-mini",
            instructions=(
                "Given a broad topic, return exactly four focused research "
                "questions that together provide comprehensive coverage. Output "
                "only a numbered list with one question per line."
            ),
        )
        plan = await Runner.run(
            planner,
            f"Research topic: {topic}",
            run_config=run_config,
        )
        questions: list[str] = []
        for line in str(plan.final_output).splitlines():
            match = re.match(r"^\s*\d+[.)]\s*(\S.*)$", line)
            if match:
                questions.append(match.group(1).strip())

        summaries: list[str] = []
        for index, question in enumerate(questions, start=1):
            self._status = f"Researching question {index} of {len(questions)}"
            await log_research_progress(
                f"Research specialist {index}/{len(questions)}: {question}"
            )
            summary = await _research_question(question, run_config)
            summaries.append(f"## Research thread {index}: {question}\n\n{summary}")

        self._status = "Synthesizing the initial report"
        await log_research_progress(f"Synthesizing {len(summaries)} research threads")
        self._draft = await _synthesize_report(topic, summaries, run_config)

        while True:
            self._status = "Waiting for human review"
            await log_research_progress(
                f"Draft round {self._review_round} is ready for review. "
                "Query get_report_draft in Cadence Web."
            )
            await cadence.workflow.wait_condition(
                lambda: self._review_decision is not None
            )

            decision = self._review_decision or ""
            self._review_decision = None
            command, _, detail = decision.partition(":")
            command = command.strip().lower()
            detail = detail.strip()

            if command == "approve":
                self._status = "Publishing approved report"
                break

            if command == "revise" and detail:
                self._review_round += 1
                self._status = f"Applying revision {self._review_round}"
                await log_research_progress(f"Applying revision request: {detail}")
                self._draft = await _edit_report(
                    self._draft,
                    f"Apply this human feedback: {detail}",
                    run_config,
                )
                continue

            if command == "expand" and detail:
                self._review_round += 1
                self._status = f"Expanding research for: {detail}"
                await log_research_progress(
                    f"Launching an additional research specialist for: {detail}"
                )
                new_summary = await _research_question(detail, run_config)
                summaries.append(
                    f"## Additional research thread: {detail}\n\n{new_summary}"
                )
                self._draft = await _edit_report(
                    self._draft,
                    (
                        f"Expand the report with a clearly labeled section for "
                        f"'{detail}'."
                    ),
                    run_config,
                    new_research=new_summary,
                )
                continue

            self._status = (
                "Unknown review decision. Use approve, revise: feedback, or "
                "expand: topic."
            )

        result = await publish_research_report(self._draft, topic)
        self._status = result
        await log_research_progress(result)
        return result


def _render_report_review(
    *,
    status: str,
    draft: str,
    review_round: int,
    domain: str,
    workflow_id: str,
    run_id: str,
) -> str:
    if not draft:
        return dedent(
            f"""\
            # Auto Research

            **Status:** {status}

            The first report draft is not ready yet.
            """
        )

    controls = dedent(
        f"""\
        # Auto Research Review

        **Status:** {status}  
        **Revision round:** {review_round}

        Use **Workflow Actions → Signal** in Cadence Web.

        Set the signal name to `review_report`, then provide one JSON string:

        - Revise: `"revise: make the executive summary shorter"`
        - Expand: `"expand: recent advances in clinical trials"`
        - Approve and publish: `"approve"`

        You can also send review signals with the Cadence CLI:

        ```bash
        cadence --domain {domain} workflow signal \\
          --workflow_id {workflow_id} \\
          --name review_report --input '"revise: make the executive summary shorter"'

        cadence --domain {domain} workflow signal \\
          --workflow_id {workflow_id} \\
          --name review_report --input '"expand: recent advances in clinical trials"'
        ```
        """
    ).strip()
    return f"{controls}\n\n---\n\n{draft}"
