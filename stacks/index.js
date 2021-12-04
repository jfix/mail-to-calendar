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
      SLACK_USER_TOKEN: ssm.StringParameter.valueForStringParameter(stack, "/squash/SLACK_USER_TOKEN"),
      SLACK_CHANNEL: ssm.StringParameter.valueForStringParameter(stack, "/squash/SLACK_CHANNEL"),
      EMAIL_RECIPIENTS: ssm.StringParameter.valueForStringParameter(stack, "/squash/EMAIL_RECIPIENTS"),
      SCRIPT_VERSION: process.env.npm_package_version,
    }
  }));
  new MyStack(app, "my-stack");

  // Add more stacks
}
