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
	startTime = performance.now();
	console.log('시작시간', startTime);
	requestAnimationFrame(move);
});

function move(time) {
	let timelast = time - startTime;

	//매 반복횟수마다 현재 걸리는 누적시간을 전체시간으로 나누면 0~1사이의 실수값이 반환 (해당실수 * 100)
	//progress : 설정한 시간대비 현재 반복되는 수치값의 진행상황을 0~1사이의 실수값으로 반환한 값
	let progress = timelast / speed;
	console.log('누적시간', timelast);
	console.log('진행률', progress);
	console.log('반복횟수', count++);
	console.log('-------------------');

	//만약 진행률이 음수가 되거나 1을 넘어서면 각각 0, 1로 강제 보정처리 (console상에는 음수로 뜨게되지만 그 뜬 값을 보정하기 위해 아래 함수를 쓰는 것. 따라서 보정된 것을 console로 확인은 안됨)
	progress < 0 && (progress = 0);
	progress > 1 && (progress = 1);

	//진행률이 1에 도달하면 원하는 시간이 끝난 시점으로 반복 종료
	progress < 1 && requestAnimationFrame(move);

	box.style.marginLeft = targetValue * progress + 'px';
}
