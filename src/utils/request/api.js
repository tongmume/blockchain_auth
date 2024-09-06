import axios from 'axios';
import axiosRetry from 'axios-retry';
import i18n from '@/i18n'

const { t } = i18n.global
// 创建 Axios 实例
const api = axios.create({
  timeout: 10000, // 设置超时为 10 秒
});

// 配置重试机制
axiosRetry(api, {
  retries: 3, // 重试次数
  retryDelay: (retryCount) => retryCount * 1000, // 每次重试间隔 1 秒
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error),
});

let cancelTokenSource;

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    if (config.cancelToken) {
      cancelTokenSource = axios.CancelToken.source();
      config.cancelToken = cancelTokenSource.token;
    }

    if (!config.baseURL) {
      config.baseURL = process.env.VITE_API_BASE_URL || 'https://www.baidu.com';
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.showLoading) {
      // 调用显示 loading 的函数
      showLoadingToast({
        message: '',
        forbidClick: true,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 隐藏 loading
    closeToast();
    return response;
  },
  (error) => {// 隐藏 loading
    closeToast();
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 请求队列
const requestQueue = [];
let isRequestProcessing = false;

// 处理队列中的请求
const processQueue = async () => {
  if (isRequestProcessing || requestQueue.length === 0) return;

  isRequestProcessing = true;
  while (requestQueue.length > 0) {
    const { id, config, resolve, reject } = requestQueue.shift(); // 取出第一个请求
    try {
      const response = await api(config);

      // 验证响应的 URL
      if (response.request.responseURL.includes(id)) {
        resolve(response.data);
      } else {
        reject(new Error('Response mismatch'));
      }
    } catch (error) {
      reject(error);
    }
  }

  isRequestProcessing = false;
};
const generateId = (url, config) => {
  const configStr = Object.keys(config).length === 0 ? '' : JSON.stringify(config);
  return url + '';
};
// 封装网络请求方法
export const fetchData = (url, baseURL, config = {}) => {
  const id = generateId(url, config); // 生成唯一标识符
  return new Promise((resolve, reject) => {
    requestQueue.push({
      id,
      config: {
        method: 'GET',
        url,
        baseURL,
        ...config,
      },
      resolve,
      reject,
    });
    processQueue();
  });
};

// 示例的 POST 请求函数
export const postData = (url, data, baseURL, config = {}) => {
  const id = generateId(url, config); // 生成唯一标识符
  return new Promise((resolve, reject) => {
    requestQueue.push({
      id,
      config: {
        method: 'POST',
        url,
        data,
        baseURL,
        ...config,
      },
      resolve,
      reject,
    });
    processQueue();
  });
};

// 示例的 PUT 请求函数
export const putData = (url, data, baseURL, config = {}) => {
  const id = generateId(url, config); // 生成唯一标识符
  return new Promise((resolve, reject) => {
    requestQueue.push({
      id,
      config: {
        method: 'PUT',
        url,
        data,
        baseURL,
        ...config,
      },
      resolve,
      reject,
    });
    processQueue();
  });
};

// 示例的 DELETE 请求函数
export const deleteData = (url, baseURL, config = {}) => {
  const id = generateId(url, config); // 生成唯一标识符
  return new Promise((resolve, reject) => {
    requestQueue.push({
      id,
      config: {
        method: 'DELETE',
        url,
        baseURL,
        ...config,
      },
      resolve,
      reject,
    });
    processQueue();
  });
};

// 在需要时取消请求
export const cancelRequest = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('Request canceled by the user.');
  }
};
