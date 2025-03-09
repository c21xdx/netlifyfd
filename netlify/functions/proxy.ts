// netlify/edge-functions/proxy.ts
export default async (request: Request) => {
  const url = new URL(request.url);

  // 打印请求信息（调试用）
  console.log(`--- 新请求 ---`);
  console.log(`方法: ${request.method}`);
  console.log(`路径: ${url.pathname}`);
  console.log(`查询参数: ${JSON.stringify(Object.fromEntries(url.searchParams))}`);
  console.log('请求头:', Object.fromEntries(request.headers));

  // 仅处理路径为 /xblog 的请求
  if (url.pathname.startsWith('/xblog')) {
    try {
      // 转发到目标服务器（保留原始路径）
      const targetUrl = `http://129.146.244.132:8085${url.pathname}`;
      console.log(`转发请求到: ${targetUrl}`);

      // 克隆请求体以避免流冲突
      const clonedRequest = request.clone();
      const body = await clonedRequest.text();
      console.log('请求体:', body);

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: 'half', // 必须配置以避免流错误
      });

      // 记录目标服务器响应
      console.log('目标服务器响应状态:', response.status);
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

  // 非 /xblog 路径返回 404
  return new Response('Not Found', { status: 404 });
};
