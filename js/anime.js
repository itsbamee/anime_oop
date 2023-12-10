class Anime {
	#defOpt = { duration: 500, easing: [0, 0, 0, 0], callback: null };

	constructor() {
		//초기 인스턴스 복사시 setCDN만 먼저 호출해서 cdn코드 먼저 삽입되도록 처리
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

	//추후 인스턴스로부터 animate메서드를 직접 호출해야 모션실행되도록 함수 분리
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
		//let result = currentValue + (value - currentValue) * progress;

		if (isString === 'string') this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}
}
