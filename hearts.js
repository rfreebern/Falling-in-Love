!function (window, undefined) {
    var document = window.document;

    var Hearts = function (options) {
        if (!this.go) {
            return new Hearts(options);
        }

        merge(this, options || {}, defaults);
        loadCSS();
        this.go();
    }

    var defaults = {
        element: document.documentElement,
        zIndex: -999999,
        maxHearts: 12,
        newHeartDelay: 600,
        colors: ['red', 'deeppink', 'blueviolet', 'fuchsia', 'orchid'],
        minOpacity: 0.2,
        maxOpacity: 1.0,
        minScale: 0.4,
        maxScale: 2.4,
        minDuration: 4,
        maxDuration: 18,
        endAfterNumHearts: 0,
        endAfterNumSeconds: 0
    };

    function merge (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var key in def) {
                if (obj[key] === undefined) obj[key] = def[key];
            }
        }
        return obj;
    }

    function heartDOM () {
        var c = document.createElement('div');
        c.className = 'heart-container';

        var h = document.createElement('div');
        h.className = 'heart';
        h.innerHTML = '&hearts;';

        c.appendChild(h);
        return [c, h];
    }

    function loadCSS () {
        if (!document.getElementById('heartsCSSfile')) {
            var l = document.createElement('link');
            var properties = {
                id:    'heartsCSSfile',
                rel:   'stylesheet',
                type:  'text/css',
                href:  '//rfreebern.github.com/Falling-in-Love/hearts.min.css',
                media: 'screen'
            };
            for (p in properties) {
                l[p] = properties[p];
            }
            document.getElementsByTagName('head')[0].appendChild(l);
        }
    }

    function getHearts (element) {
        var hearts = element.lastChild;
        while (hearts && hearts.className !== 'hearts') {
            hearts = hearts.previousSibling;
        }
        return hearts;
    }

    function randVal (min, max) {
        return min + Math.random() * (max - min);
    }

    function getPosition (el) {
        var position = { x: el.offsetLeft, y: el.offsetTop };
        while (el = el.offsetParent) {
            position.x += el.offsetLeft;
            position.y += el.offsetTop;
        }
        return position;
    }

    function getHeight (el) {
        var height = el.offsetHeight;
        if (el === document.documentElement) {
            height = Math.max(
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                window.innerHeight
            );
        }
        return height;
    }

    var runner = false;
    var totalHearts = 0;
    var startTime = false;

    Hearts.prototype.stop = function (instant) {
        clearTimeout(runner);
        if (instant) {
            this.element.removeChild(getHearts(this.element));
        } else {
            var self = this;
            setTimeout(function () {
                self.element.removeChild(getHearts(self.element));
            }, this.maxDuration * 1000 + 1000);
        }
    };

    Hearts.prototype.go = function () {
        var self = this;
        if ((this.endAfterNumSeconds > 0 && startTime && new Date().getTime() >= startTime + this.endAfterNumSeconds * 1000)
            ||
            (this.endAfterNumHearts > 0 && totalHearts >= this.endAfterNumHearts)) {
            return this.stop();
        }
        var hearts = getHearts(this.element);
        var height = getHeight(this.element);

        // On the first execution, create the container element.
        if (!hearts) {
            startTime = new Date().getTime();
            hearts = document.createElement('div');
            var position = getPosition(this.element);
            var properties = {
                width: this.element.offsetWidth + 'px',
                height: height + 'px',
                top: position.y + 'px',
                left: position.x + 'px',
                zIndex: this.zIndex,
            };
            for (p in properties) {
                hearts.style[p] = properties[p];
            }
            hearts.className = 'hearts';
            this.element.appendChild(hearts);
        }

        // Account for changing height due to delayed CSS, etc.
        if (height !== hearts.style.height.replace('px', '')) {
            hearts.style.height = height + 'px';
        }

        // If there are enough hearts on-screen already, don't add another.
        if (hearts.childNodes.length >= this.maxHearts) {
            return setTimeout(function () { self.go(); }, self.newHeartDelay);
        }
        
        // Construct new heart DOM elements.
        var dom = heartDOM();

        // Pick a random animation.
        var anims = ['swing', 'twirl'];
        var a = anims[Math.round(Math.random() * (anims.length - 1))];

        // Pick a random color and opacity.
        var colors = this.colors; 
        var color = this.colors[Math.round(Math.random() * (this.colors.length - 1))];
        dom[1].style.color = color;
        dom[1].style.opacity = randVal(this.minOpacity, this.maxOpacity);

        // Pick a random location, speed, and size.
        dom[0].style.left = (15 + Math.random() * (hearts.scrollWidth - 30)) + 'px';

        for (v in { '': 1, 'Moz': 1, 'Webkit': 1, 'O': 1, 'ms': 1 }) {
            dom[1].style[v + 'AnimationName'] = a;
            dom[0].style[v + 'AnimationDuration'] = randVal(this.minDuration, this.maxDuration) + 's';
            dom[0].style[v + 'Transform'] = 'scale(' + randVal(this.minScale, this.maxScale) + ')';
        }

        // Let it go!
        hearts.appendChild(dom[0]);
        totalHearts++;

        // Once it reaches the bottom of the element, get rid of it.
        dom[0].addEventListener('animationend', function () { hearts.removeChild(dom[0]); });
        for (v in { 'webkit': 1, 'o': 1, 'MS': 1 }) {
            dom[0].addEventListener(v + 'AnimationEnd', function () { hearts.removeChild(dom[0]); });
        }

        runner = setTimeout(function () { self.go(); }, self.newHeartDelay);
    };

    window.Hearts = Hearts;
}(window);
