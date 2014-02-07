(function(G) {

  function toArray(o) {
    return Array.prototype.slice.call(o);
  }

  function isObject(o) {
    return typeof(o)==='object';
  }

  function copy(fn) {
    return function() {
      fn.apply(this, toArray(arguments));
    }
  }

  function extend(target, source, k) {
    for(k in source) {
      target[k] = source[k];
    }
    return target;
  }

  function xhr(a) {
    for(a=0;a<4;a++) try {
      return a
        ?new ActiveXObject([
          ,
          'Msxml2',
          'Msxml3',
          'Microsoft'
        ][a]+'.XMLHTTP')
        :new XMLHttpRequest
    }
    catch(e) {}
  }

  function ajax(
    method,   // method - get, post, whatever
    url,      // url
    callback, // [callback] if passed -> async call
    data,     // [post_data]
    req
  ) {
    req = xhr();
    req.onreadystatechange = function() {
      req.readyState^4||callback(this) // if callback passed and readyState == 4 then trigger callback with xhr object
    };
    req.open(method, url, callback);
    req.send(data);
    return req;
  }

  function jsonp(
    a, // the url, such as "http://test.com/foo?q=bar&callback="
    b, // the callback function
    c, // placeholder
    d  // placeholder
  ){
    with (document) body // on the document body,
      .appendChild(      // attach
        createElement(   // a created script.
          d = "script"   // set d to "script", used later as prefix
        )
      )
      .src = a + (  // set src to url +
        c = d + (   // the name on the window, which is "script" +
          jsonp.a =     // the current increment, which is
            -~jsonp.a   // itself + 1, coercing to 1 if not yet defined,
        )
      );

    (a=window)[c] = function(d) { // put the callback on the window object, and
      a[c] = b(d)                 // call/clear it when it's done.
    }
  }

  G.g = {
    toAr: copy(toArray),
    ex: copy(extend),
    x: copy(ajax),
    jp: copy(jsonp),
    cp: copy(copy)
  };
})(this);