/*
  performance.now();
  1ms 단위로 정밀한 시간계산이 가능
  브라우저가 웹화면을 로딩한 순간부터의 해당 구문이 호출된 시점까지의 누적시간을 ms단위로 반환
*/

const btn = document.querySelector('button');
const box = document.querySelector('#box');
let num = 0;
let startTime = 0;

btn.addEventListener('click', () => {
	startTime = performance.now();
	console.log('시작시간', startTime);
	//버튼 클릭시 requestAnimationFrame으로 move함수를 호출
	requestAnimationFrame(move);
});

function move() {
	num++; //1씩 증가시킴
	box.style.marginLeft = num + 'px';

	if (num >= 100) {
		return;
	}
	//버튼 클릭시 requestAnimationFrame에 의해서 move함수가 호출되면
	//move함수 내부적으로 다시 requestAnimationFrame으로 자기 자신을 또 호출하면서 반복실행됨
	requestAnimationFrame(move);
}
