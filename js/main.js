/*
  performance.now();
  1ms 단위로 정밀한 시간계산이 가능
  브라우저가 웹화면을 로딩한 순간부터의 해당 구문이 호출된 시점까지의 누적시간을 ms단위로 반환

  requestAnimationFrame에서 화면주사율에 의해서 반복횟수가 정해지기 때문에 모션의 시간제어 불가능
  결국 정해진 반복횟수 안에서 원하는 시간동안 모션처리를 하기 위해서는 반복횟수랑 최종 수치값이 변경되야 되는 변화폭을 제어
*/

const btn = document.querySelector('button');
const box = document.querySelector('#box');
const speed = 1000;
const targetValue = 500;
let count = 0;
let startTime = 0;

btn.addEventListener('click', () => {
	anime(box, {
		prop: 'top',
		value: '100%',
		duration: 1000,
	});
});

function anime(selector, option) {
	const startTime = performance.now();
	let currentValue = parseInt(getComputedStyle(selector)[option.prop]);

	//만약 value로 받은 값이 문자열이면 퍼센트 연산처리
	const isString = typeof option.value;
	if (isString === 'string') {
		//백분율을 구하기 위해서 선택자의 직계부모의 넓이, 높이값을 미리 구함
		const parentW = parseInt(getComputedStyle(selector.parentElement).width);
		const parentH = parseInt(getComputedStyle(selector.parentElement).height);
		currentValue = (currentValue / parentW) * 100;
		option.value = parseFloat(option.value);
	}
	requestAnimationFrame(move);

	function move(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;
		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1 ? requestAnimationFrame(move) : option.callback && option.callback();

		//result = 현재 수치값 + (변경할만큼의 수치값 * 진행률)
		let result = currentValue + (option.value - currentValue) * progress;
		//전달된 value값이 문자열이면 percent 처리해야 되므로 result뒤에 % 붙이기
		//그렇지 않으면 px단위이니 result뒤에 px처리
		if (isString === 'string') selector.style[option.prop] = result + '%';
		else selector.style[option.prop] = result + 'px';
	}
}
