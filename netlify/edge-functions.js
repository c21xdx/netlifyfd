export default {
  async fetch(request) {
    // 获取请求方法
    const method = request.method;

    // 处理 GET 请求
    if (method === 'GET') {
      return new Response('Hello World', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // 处理 POST 请求（反向代理到 http://xray.com/xhttp）
    else if (method === 'POST') {
      // 构造目标 URL
      const targetUrl = new URL('http://129.146.244.132:8085/xblog');

      // 创建代理请求对象
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers, // 保留原始请求头
        body: await request.text(), // 读取请求体（假设为文本格式）
      });

      // 发送请求到目标服务器
      const response = await fetch(proxyRequest);

      // 返回响应（保留原始响应头和状态码）
      return new Response(response.body, response);
    }

    // 其他方法返回 405 状态码
    else {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
};
