export function handleConnection() {
	if (navigator.onLine) {
		isReachable("http://127.0.0.1:20001").then(function (online) {
			if (online) console.log("Online")
			console.log("offline")
		});
	}
	console.log("offline")
}

export function isReachable(url: string) {
	return fetch(url, { method: 'HEAD', mode: 'no-cors' })
		.then(function (resp) {
			return resp && (resp.ok || resp.type === 'opaque');
		})
		.catch(function (err) {
			console.warn('[conn test failure]:', err);
		});
}
