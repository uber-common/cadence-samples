// waits for time to pass in milliseconds.
const waitTime = (time) => new Promise((resolve) => setTimeout(resolve, time));
export default waitTime;
