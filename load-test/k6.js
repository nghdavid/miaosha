import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 6000,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100,
      maxVUs: 100000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http request 失敗的總比例要低於 1% 才能算通過
    http_req_duration: ['p(95)<1000'], // 95% 的 requests 數回傳時間都要低於 1000ms 以內才算通過
  },
};
// test HTTP
export default function () {
  const DNS = 'https://publisher.miaosha.click';
  const url = `${DNS}/api/1.0/miaosha`;
  const payload = JSON.stringify({ id: 1, question: 1, answer: 'A' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, {
    'status was 200': (r) => r.status === 200,
  });
}
