const Templater = (function() {
  let Templater = function() {
    return new Templater.function.init();
  };
  function h(tagName, props, ...children) {
    return {
      tagName,
      props,
      children,
    };
  }
  Templater.function = Templater.prototype = {
    constructor: Templater,
    init: function () {
      this.stack = [];
      return this;
    }
  };
  Templater.function.init.prototype = Templater.function;
  return Templater;
})();

Templater.prototype.fluent = function(impl) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    // Prepend the last return value for this object only if arg length is 0
    if (!args.length && typeof this.$lastReturn !== 'undefined') {
      args.unshift(this.$lastReturn);
    }
    this.$lastReturn = impl.apply(this, args);
    return this;
  }
}
Templater.prototype.isProps = function (obj) {
  return typeof obj === "object" &&
      !obj.hasOwnProperty("children") &&
      !obj.hasOwnProperty("stack");
}

Templater.prototype.p = function() {
  const copyArgs = Array.from(arguments).slice(0);
  this.createElement("p", copyArgs);
  return this;
};

Templater.prototype.createElement = function (tagName, args) {
  let props = {};

  let lastIdx = args.length - 1;
  const isLastProps = this.isProps(args[lastIdx]);

  if (isLastProps) {
    props = { ...args[lastIdx] };
    args = args.slice(0, lastIdx);
    lastIdx--;
  }

  if (typeof args[lastIdx] === "string") {
    this.stack.push(this.h(tagName, props, ...args));
  } else {
    let childs = [...this.stack];
    for (let x of args) {
      childs = [...childs, ...x.stack];
    }
    const temp = this.h(tagName, props, ...childs);

    this.stack = [];
    this.stack.push(temp);
  }
}

Templater.prototype.div = function() {
  const copyArgs = Array.from(arguments).slice(0);
  this.createElement("div", copyArgs);
  return this;
}

Templater.prototype.span = function() {
  const copyArgs = Array.from(arguments).slice(0);
  this.createElement("span", copyArgs);
  return this;
};

Templater.prototype.br = function() {
  if (Array.from(arguments).length) {
    throw Error("Nested content is not allowed");
  }
  // const copyArgs = Array.from(arguments).slice(0);
  this.createElement("br", []);
  return this;
}

Templater.prototype.render = function (element) {
  let attrs = [];
  if (Object.keys(element.props).length) {
    const sortedKeys = Object.keys(element.props).sort();
    sortedKeys.forEach(keyName => {
      attrs.push(" " + keyName + "=\"" + element.props[keyName] + "\"");
    });
  }

  let result = "<" + element.tagName + attrs.join("") + ">";

  element.children.forEach(x => {
    if (typeof x === "string") {
      result += x;
    } else {
      result += this.render(x);
    }
  });

  if (element.tagName !== "br") {
    result += "</" + element.tagName + ">";
  }

  return result;
}

Templater.prototype.toString = function () {
  const html = this.stack.reduce((acc, x) => {
    return acc + this.render(x);
  }, "");
  this.stack = [];
  return html;
}

Templater.prototype.h = function (tagName, props, ...children) {
  return {
    tagName,
    props,
    children,
  };
}

Templater.prototype.valueOf = function (c) {
  return this.$lastReturn;
};

module.exports = function() {
  return new Templater();
};