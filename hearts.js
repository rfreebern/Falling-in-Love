(function (window, undefined) {
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
        element: document.body,
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
                href:  'hearts.css',
                media: 'screen'
            };
            for (p in properties) {
                l[p] = properties[p];
            }
            document.getElementsByTagName('head')[0].appendChild(l);
        }
    }

    function findElement (element, className) {
        var hearts = element.lastChild;
        while (hearts && hearts.className !== className) {
            hearts = hearts.previousSibling;
        }
        return hearts;
    }

    function randVal (min, max) {
        return min + Math.random() * (max - min);
    }

    var runner = false;
    var totalHearts = 0;
    var startTime = false;

    Hearts.prototype.stop = function (instant) {
        clearTimeout(runner);
        console.log('stopping. ' + this.element);
        if (instant) {
            findElement(this.element, 'hearts').style.display = 'none';
        } else {
            var self = this;
            setTimeout(function () {
                findElement(self.element, 'hearts').style.display = 'none';
            }, this.maxDuration * 1000 + 1000);
        }
    };

    Hearts.prototype.go = function () {
        var self = this;
        if (
            (this.endAfterNumSeconds > 0 && new Date().getTime() >= startTime + this.endAfterNumSeconds * 1000)
            ||
            (this.endAfterNumHearts > 0 && totalHearts >= this.endAfterNumHearts)
        ) {
            return this.stop();
        }
        var hearts = findElement(this.element, 'hearts');
        if (!hearts) {
            startTime = new Date().getTime();
            hearts = document.createElement('div');
            var properties = {
                width: this.element.clientWidth + 'px',
                height: this.element.clientHeight + 'px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -99999,
                overflow: 'hidden'
            };
            for (p in properties) {
                hearts.style[p] = properties[p];
            }
            hearts.className = 'hearts';
            this.element.appendChild(hearts);
        }

        if (hearts.childNodes.length >= this.maxHearts) {
            return setTimeout(function () { self.go(); }, self.newHeartDelay);
        }
        
        // Construct new heart DOM elements.
        var dom = heartDOM();

        // Pick a random animation.
        var anims = ['swing', 'twirl'];
        var a = anims[Math.round(Math.random() * (anims.length - 1))];
        dom[1].style.WebkitAnimationName = a;
        dom[1].style.MozAnimationName = a;

        // Pick a random color and opacity.
        var colors = this.colors; 
        var color = colors[Math.round(Math.random() * (colors.length - 1))];
        dom[1].style.color = color;
        dom[1].style.opacity = randVal(this.minOpacity, this.maxOpacity);

        // Pick a random location, speed, and size.
        dom[0].style.left = (10 + Math.random() * (hearts.scrollWidth - 10)) + 'px';
        dom[0].style.WebkitAnimationDuration = randVal(this.minDuration, this.maxDuration) + 's';
        dom[0].style.WebkitTransform = 'scale(' + randVal(this.minScale, this.maxScale) + ')';
        dom[0].style.MozAnimationDuration = randVal(this.minDuration, this.maxDuration) + 's';
        dom[0].style.MozTransform = 'scale(' + randVal(this.minScale, this.maxScale) + ')';

        // Let it go!
        hearts.appendChild(dom[0]);
        totalHearts++;

        // Once it reaches the bottom of the page, get rid of it.
        dom[0].addEventListener('animationend', function () { hearts.removeChild(dom[0]); });
        dom[0].addEventListener('webkitAnimationEnd', function () { hearts.removeChild(dom[0]); });

        runner = setTimeout(function () { self.go(); }, self.newHeartDelay);
    };

    window.Hearts = Hearts;
})(window);
