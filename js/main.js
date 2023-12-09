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
		prop: 'padding-left',
		value: '50%',
		duration: 1000,
	});
});

function anime(selector, option) {
	const startTime = performance.now();
	let currentValue = parseInt(getComputedStyle(selector)[option.prop]);

	const isString = typeof option.value;
	if (isString === 'string') {
		const parentW = parseInt(getComputedStyle(selector.parentElement).width);
		const parentH = parseInt(getComputedStyle(selector.parentElement).height);

		//가로나 세로축으로 퍼센트 적용할만한 속성명을 미리 배열로 그룹화
		const x = ['left', 'right', 'width'];
		const y = ['top', 'bottom', 'height'];

		//속성명으로 가로축 관련 값이면 parentW값을 활용해서 퍼센트 변환
		for (let cond of x) option.prop === cond && (currentValue = (currentValue / parentW) * 100);

		//속성명으로 세로축 관련 값이면 parentH값을 활용해서 퍼센트 변환
		for (let cond of y) option.prop === cond && (currentValue = (currentValue / parentH) * 100);

		//속성명으로 margin, padding 구문이 있으면 실행을 중지하면서 경고문구 출력
		if (option.prop.includes('margin') || option.prop.includes('padding'))
			return console.error('margin, padding 속성은 퍼센트를 적용할 수 없습니다.');

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
