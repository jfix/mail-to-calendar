import MyStack from "./MyStack";
import * as ssm from '@aws-cdk/aws-ssm';

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps((stack) => ({
    runtime: "nodejs12.x",
    environment: {
      CALENDAR_ID: ssm.StringParameter.valueForStringParameter(stack, "/squash/CALENDAR_ID"),
      GOOGLE_APPLICATION_CREDENTIALS_EMAIL: ssm.StringParameter.valueForStringParameter(stack, "/squash/GOOGLE_APPLICATION_CREDENTIALS_EMAIL"),
      GOOGLE_APPLICATION_CREDENTIALS_KEY: ssm.StringParameter.valueForStringParameter(stack, "/squash/GOOGLE_APPLICATION_CREDENTIALS_KEY"),
      GOOGLE_APPLICATION_CREDENTIALS_KEY_ID: ssm.StringParameter.valueForStringParameter(stack, "/squash/GOOGLE_APPLICATION_CREDENTIALS_KEY_ID"),
    }
  }));

  // console.log(`ssm.CALENDAR ID: ${ssm.StringParameter.valueForStringParameter(stack,  "/squash/CALENDAR_ID")}`);
  console.log(`env.CALENDAR ID: ${process.env.CALENDAR_ID}`);
  new MyStack(app, "my-stack");

  // Add more stacks
}
