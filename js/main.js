const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/dist/bezier-easing.min.js';
script.async = true;
document.body.appendChild(script);
//의존성 cdn script 동적으로 추가

const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, { left: 1000 }, 500);
});

function anime(selector, props, duration, callback) {
	const startTime = performance.now();
	const keys = Object.keys(props);
	const values = Object.values(props);

	keys.forEach((key, idx) => setValue(key, values[idx], selector, duration, callback));

	function setValue(key, value, selector, duration, callback) {
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
			let progress = timelast / duration;

			//cubic-bezier 사이트에서 원하는 가속도 수치값을 구한 뒤 해당 값을 활용한 easing적용함수에 progress값 적용
			const easingfunc = BezierEasing(0.46, -0.51, 0.58, 1.5);
			// const easingfunc = BezierEasing(0, 0, 0, 0);
			const easingProgress = easingfunc(progress);

			progress < 0 && (progress = 0);
			progress > 1 && (progress = 1);
			progress < 1 ? requestAnimationFrame(move) : callback && callback();

			//let result = currentValue + (value - currentValue) * progress;
			let result = currentValue + (value - currentValue) * easingProgress;

			if (isString === 'string') selector.style[key] = result + '%';
			else if (key === 'opacity') selector.style[key] = result;
			else if (key === 'scroll') selector.scroll(0, result);
			else selector.style[key] = result + 'px';
		}
	}
}
