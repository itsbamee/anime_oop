/*
  performance.now();
  1ms 단위로 정밀한 시간계산이 가능
  브라우저가 웹화면을 로딩한 순간부터의 해당 구문이 호출된 시점까지의 누적시간을 ms단위로 반환

  requestAnimationFrame에서 화면주사율에 의해서 반복횟수가 정해지기 때문에 모션의 시간제어 불가능
  결국 정해진 반복횟수 안에서 원하는 시간동안 모션처리를 하기 위해서는 반복횟수랑 최종 수치값이 변경되야 되는 변화폭을 제어
*/

const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, { left: '50%', opacity: 0, height: '200%' }, 1000);
});

function anime(selector, props, duration, callback) {
	const startTime = performance.now();
	const keys = Object.keys(props);
	const values = Object.values(props);

	keys.forEach((key, idx) => setValue(key, values[idx], selector, duration, callback));

	function setValue(key, value, selector, duration, callback) {
		let currentValue = parseFloat(getComputedStyle(selector)[key]);

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

		//해당 코드 isString 조건문 밖으로 빼기 (오류해결)
		requestAnimationFrame(move);

		//해당 코드 isString 조건문 밖으로 빼기 (오류해결)
		function move(time) {
			let timelast = time - startTime;
			let progress = timelast / duration;
			progress < 0 && (progress = 0);
			progress > 1 && (progress = 1);
			progress < 1 ? requestAnimationFrame(move) : callback && callback();

			let result = currentValue + (value - currentValue) * progress;

			if (isString === 'string') selector.style[key] = result + '%';
			else if (key === 'opacity') selector.style[key] = result;
			else selector.style[key] = result + 'px';
		}
	}
}
