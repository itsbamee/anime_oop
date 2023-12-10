const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/dist/bezier-easing.min.js';
script.async = true;
document.body.appendChild(script);
//의존성 cdn script 동적으로 추가

const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	//0.46, -0.51, 0.58, 1.5
	anime(
		box,
		{ left: 1000 },
		{ duration: 500, easing: [0, 0, 0, 0], callback: () => console.log('complete') }
	);
});

function anime(selector, props, opt) {
	const defOpt = { duration: 500, easing: [0, 0, 0, 0], callback: null };
	const resultOpt = { ...defOpt, ...opt };

	const startTime = performance.now();
	const keys = Object.keys(props);
	const values = Object.values(props);

	keys.forEach((key, idx) => setValue(key, values[idx]));

	function setValue(key, value) {
		let currentValue = null;

		//key값이 만약 스크롤이면 value값을 getComputedStyle로 구하는 값이 아니므로 분기처리
		key === 'scroll'
			? (currentValue = selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(selector)[key]));

		const isString = typeof value;
		if (isString === 'string') {
			const parentW = parseInt(getComputedStyle(selector.parentElement).width);
			const parentH = parseInt(getComputedStyle(selector.parentElement).height);
			const x = ['left', 'right', 'width'];
			const y = ['top', 'bottom', 'height'];

			for (let cond of x) key === cond && (currentValue = (currentValue / parentW) * 100);
			for (let cond of y) key === cond && (currentValue = (currentValue / parentH) * 100);
			if (key.includes('margin') || key.includes('padding'))
				return console.error('margin, padding 속성은 퍼센트 적용할 수 없습니다.');

			value = parseFloat(value);
		}

		requestAnimationFrame(move);

		function move(time) {
			let timelast = time - startTime;
			let progress = timelast / resultOpt.duration;

			const easingfunc = BezierEasing(...resultOpt.easing);
			const easingProgress = easingfunc(progress);

			progress < 0 && (progress = 0);
			progress > 1 && (progress = 1);
			progress < 1 ? requestAnimationFrame(move) : resultOpt.callback && resultOpt.callback();

			let result = currentValue + (value - currentValue) * easingProgress;

			if (isString === 'string') selector.style[key] = result + '%';
			else if (key === 'opacity') selector.style[key] = result;
			else if (key === 'scroll') selector.scroll(0, result);
			else selector.style[key] = result + 'px';
		}
	}
}
