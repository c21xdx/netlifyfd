// netlify/edge-functions/proxy.ts
export default async (request: Request) => {
  const url = new URL(request.url);

  // 打印基础请求信息
  console.log(`--- 新请求 ---`);
  console.log(`方法: ${request.method}`);
  console.log(`路径: ${url.pathname}`);
  console.log(`查询参数: ${JSON.stringify(Object.fromEntries(url.searchParams))}`);

  // 打印请求头
  console.log('请求头:', Object.fromEntries(request.headers));

  // 处理 GET 请求
  if (request.method === 'GET') {
    console.log('处理 GET 请求，返回 Hello World');
    return new Response('Hello World', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 处理 POST 请求
  if (request.method === 'POST') {
    try {
      // 打印请求体（注意：需克隆请求体以避免消耗流）
      const clonedRequest = request.clone();
      const body = await clonedRequest.text();
      console.log('请求体:', body);

      // 转发到目标服务器
      console.log('转发 POST 请求到 http://129.146.244.132:8085/xblog');
      const response = await fetch('http://129.146.244.132:8085/xblog', {
        method: 'POST',
        headers: request.headers,
        body: request.body,
      });

      // 打印响应信息
      console.log('目标服务器响应状态:', response.status);
      console.log('目标服务器响应头:', Object.fromEntries(response.headers));
      const responseBody = await response.clone().text();
      console.log('目标服务器响应体:', responseBody);

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
  console.log('不支持的请求方法:', request.method);
  return new Response('Method Not Allowed', { status: 405 });
};
