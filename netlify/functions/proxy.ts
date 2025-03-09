export default async (request: Request) => {
  const url = new URL(request.url);

  // 打印基础请求信息
  console.log(`--- 新请求 ---`);
  console.log(`方法: ${request.method}`);
  console.log(`路径: ${url.pathname}`);

  // 处理 GET 请求
  if (request.method === 'GET') {
    return new Response('Hello World', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 处理 POST 请求
  if (request.method === 'POST') {
    try {
      // 转发到目标服务器
      const target = 'http://129.146.244.132:8085/xblog';
      const response = await fetch(target, {
        method: 'POST',
        headers: request.headers,
        body: request.body,
        duplex: 'half', // 关键修复：添加此行
      });

      // 返回目标服务器的响应
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      console.error('转发失败:', error);
      return new Response('Proxy Error', { status: 502 });
    }
  }

  // 其他方法返回 405
  return new Response('Method Not Allowed', { status: 405 });
};
