import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { userOptions } from '../constant';

export async function chatgptDemo() {
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: userOptions.openAISessionToken,
    apiReverseProxyUrl: 'https://bypass.churchless.tech/api/conversation',
    // apiReverseProxyUrl: 'https://api.pawan.krd/backend-api/conversation',
  });

  const res = await api.sendMessage('Hello World!');
  console.log(res.text);
}
