export default async (request, context) => {
  try {
    const url = new URL(request.url);

    // 获取目标 URL (从环境变量获取)
    const targetUrl = Deno.env.get("TARGET_URL");

    if (!targetUrl) {
      return new Response("TARGET_URL environment variable not set", { status: 500 });
    }

    // 构造目标 URL
    const target = new URL(targetUrl + url.pathname + url.search);

    // 创建新的请求
    const newReq = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual' // 阻止自动重定向
    });

    // 转发请求并获取响应
    const response = await fetch(newReq);

    // 处理响应
    const { body, headers, status, statusText } = response;

    // 创建新的响应
    const newResponse = new Response(body, {
      status,
      statusText,
      headers: new Headers(headers),
    });

    // 设置 CORS 头部 (允许所有来源) - 生产环境需要修改
    newResponse.headers.set("access-control-allow-origin", "*");

    return newResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Proxy error", { status: 500 });
  }
};

export const config = {
  path: "/*", // 匹配所有路径
};
