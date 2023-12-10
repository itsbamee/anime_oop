class Anime {
	#defOpt = { duration: 500, easing: [0, 0, 0, 0], callback: null };

	constructor() {
		this.setCDN();
	}

	setCDN() {
		if (Array.from(document.scripts).filter((el) => el.id === 'bezier').length !== 0) return;
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/bezier-easing@2.1.0/dist/bezier-easing.min.js';
		script.async = true;
		script.id = 'bezier';
		document.body.appendChild(script);
	}

	animate(selector, props, opt) {
		this.resultOpt = { ...this.#defOpt, ...opt };
		this.selector = selector;
		this.startTime = performance.now();
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.keys.forEach((key, idx) => this.setValue(key, this.values[idx]));
	}

	setValue(key, value) {
		let currentValue = null;

		key === 'scroll'
			? (currentValue = this.selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(this.selector)[key]));

		const isString = typeof value;
		if (isString === 'string') {
			const parentW = parseInt(getComputedStyle(this.selector.parentElement).width);
			const parentH = parseInt(getComputedStyle(this.selector.parentElement).height);
			const x = ['left', 'right', 'width'];
			const y = ['top', 'bottom', 'height'];

			for (let cond of x) key === cond && (currentValue = (currentValue / parentW) * 100);
			for (let cond of y) key === cond && (currentValue = (currentValue / parentH) * 100);
			if (key.includes('margin') || key.includes('padding'))
				return console.error('margin, padding 속성은 퍼센트 적용할 수 없습니다.');

			value = parseFloat(value);
		}

		requestAnimationFrame((time) => this.move(time, key, value, currentValue, isString));
	}

	move(time, key, value, currentValue, isString) {
		let timelast = time - this.startTime;
		let progress = timelast / this.resultOpt.duration;

		const easingFunc = BezierEasing(...this.resultOpt.easing);
		const easingProgress = easingFunc(progress);

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1
			? requestAnimationFrame((time) => this.move(time, key, value, currentValue, isString))
			: this.resultOpt.callback && this.resultOpt.callback();

		let result = currentValue + (value - currentValue) * easingProgress;

		if (isString === 'string') this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}

	//# 색상코드값 -> rgb(숫자1, 숫자2, 숫자3)으로 변환하는 함수
	hexToRgb(hexColor) {
		const hex = hexColor.replace('#', '');
		//만약에 색상코드값이 3자리수면 해당 값을 각각 배열로 반환, 그렇지 않으면 2개씩 묶어서 배열로 반환[r,g,b]
		const rgb = hex.length === 3 ? hex.match(/[a-f\d]/gi) : hex.match(/[a-f\d]{2}/gi);

		//각 문자로 묶여져있는 [red, green, blue] => [숫자1, 숫자2, 숫자3]으로 변경해서 반환
		rgb.map((el) => {
			if (el.length === 1) el = el + el;
			return parseInt(el, 16);
		});
	}
}
