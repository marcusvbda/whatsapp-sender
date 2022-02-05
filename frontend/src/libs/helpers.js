export const validationException = (msg) => ({ type: "warning", msg });

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
