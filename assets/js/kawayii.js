var drawinput = function(t) {
  function r() {
	return f[Math.floor(Math.random() * f.length)]
  }

  function e() {
	return String.fromCharCode(94 * Math.random() + 33)
  }

  function n(t) {
	for (var n = document.createDocumentFragment(), i = 0; t > i; i++) {
	  var l = document.createElement("span");
	  l.textContent = e(), l.style.color = r(), n.appendChild(l)
	}
	return n
  }

  function i() {
	var r = a[c.skillI];
	c.step ? c.step-- : (c.step = o, c.prefixP < l.length ? (c.prefixP >= 0 && (c.text += l[c.prefixP]),
		  c.prefixP++) : "forward" === c.direction ? c.skillP < r.length ? (c.text += r[c.skillP], c.skillP++) :
		c.delay ? c.delay-- : (c.direction = "backward", c.delay = g) : c.skillP > 0 ? (c.text = c.text.slice(
		  0, -1), c.skillP--) : (c.skillI = (c.skillI + 1) % a.length, c.direction = "forward")), t.textContent = c.text, t.appendChild(n(c.prefixP < l.length ? Math.min(b, b + c.prefixP) : Math.min(b, r.length -
		c.skillP))), setTimeout(i, d)
  }
  var l = "",
	a = ["活下去~", "就要面对人生的总总处境~", "明白这个道理的话~", "我们能做的~",
	  "便是~勇敢的走下去！"
	].map(function(t) {
	  return t + ""
	}),
	g = 8,
	o = 1,
	b = 5,
	d = 75,
	f = ["rgb(110,64,170)", "rgb(150,61,179)", "rgb(191,60,175)", "rgb(228,65,157)", "rgb(254,75,131)",
	  "rgb(255,94,99)", "rgb(255,120,71)", "rgb(251,150,51)", "rgb(226,183,47)", "rgb(198,214,60)",
	  "rgb(175,240,91)", "rgb(127,246,88)", "rgb(82,246,103)", "rgb(48,239,130)", "rgb(29,223,163)",
	  "rgb(26,199,194)", "rgb(35,171,216)", "rgb(54,140,225)", "rgb(76,110,219)", "rgb(96,84,200)"
	],
	c = {
	  text: "",
	  prefixP: -b,
	  skillI: 0,
	  skillP: 0,
	  direction: "forward",
	  delay: g,
	  step: o
	};
  i()
};
drawinput(document.getElementById("kawayii"));