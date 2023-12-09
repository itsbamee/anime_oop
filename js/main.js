/*
  performance.now();
  1ms 단위로 정밀한 시간계산이 가능
  브라우저가 웹화면을 로딩한 순간부터의 해당 구문이 호출된 시점까지의 누적시간을 ms단위로 반환

  requestAnimationFrame에서 화면주사율에 의해서 반복횟수가 정해지기 때문에 모션의 시간제어 불가능
  결국 정해진 반복횟수 안에서 원하는 시간동안 모션처리를 하기 위해서는 반복횟수랑 최종 수치값이 변경되야 되는 변화폭을 제어
*/

//"1초동안" 박스가 오른쪽으로 500px위치까지 이동
const btn = document.querySelector('button');
const box = document.querySelector('#box');
const speed = 1000;
const targetValue = 500;
let num = 0;
let startTime = 0;

btn.addEventListener('click', () => {
	startTime = performance.now();
	console.log('시작시간', startTime);
	requestAnimationFrame(move);
});

function move(time) {
	//timelast : 브라우저가 로딩된 시점부터가 아닌 사용자가 버튼을 클릭한 시점부터의 누적시간
	let timelast = time - startTime;
	console.log(timelast);
	num++;
	box.style.marginLeft = num + 'px';

	if (num >= 100) {
		return;
	}
	//버튼 클릭시 requestAnimationFrame에 의해서 move함수가 호출되면
	//move함수 내부적으로 다시 requestAnimationFrame으로 자기 자신을 또 호출하면서 반복실행됨
	requestAnimationFrame(move);
}
