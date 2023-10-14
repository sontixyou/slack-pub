import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "slack-post" is now active!');

  let disposable = vscode.commands.registerCommand('slack-pub.postMessageToSlack', async () => {
    const slackToken = vscode.workspace.getConfiguration().get('slackPub.slackToken');
    if (!slackToken) {
      vscode.window.showErrorMessage('Slack API token is not configured.');
      return;
    }

    const userMessage = await vscode.window.showInputBox({ prompt: 'Enter your message for Slack:' });

    if (!userMessage) {
      vscode.window.showInformationMessage('No message provided. Message not sent to Slack.');
      return;
    }

    const channel = vscode.workspace.getConfiguration().get('slackPub.toChannel');
		if (!channel) {
      vscode.window.showErrorMessage('Slack Channel is not configured.');
      return;
    }

    const url = 'https://slack.com/api/chat.postMessage';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${slackToken}`,
    };
    const data = {
      channel,
      text: userMessage,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      vscode.window.showInformationMessage('Message sent to Slack successfully!');
    } else {
      vscode.window.showErrorMessage(`Failed to send message to Slack. Status code: ${response.status}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
