describe('n3utils', function() {

  describe('getBestColumnWidth', function() {
    it('handle no data', inject(function(n3utils) {
      expect(n3utils.getBestColumnWidth({}, [])).toBe(10);
    }));
  });

  it('should compute data per series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8}
    ];

    var options = {
      series: [
        {y: 'value', axis: 'y2', color: 'steelblue'},
        {y: 'foo', color: 'red', type: 'area'}
      ]
    };

    var expected = [{
      name: 'value', color: 'steelblue', axis: 'y2', type: 'line', index: 0,
      values: [
        {x: 0, value: 4, axis: 'y2'}, {x: 1, value: 8, axis: 'y2'}
      ]
    }, {
      name: 'foo', color: 'red', axis: 'y', type: 'area', index: 1,
      values: [
        {x: 0, value: 4.154, axis: 'y'}, {x: 1, value: 8.15485, axis: 'y'}
      ]
    }];

    expect(n3utils.getDataPerSeries(data, options)).toEqual(expected);

  }));

  it('should compute the widest y value', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
    ];

    var series = [{y: 'value'}];
    expect(n3utils.getWidestOrdinate(data, series)).toBe(15);

    series = [{y: 'value'}, {y: 'foo'}];
    expect(n3utils.getWidestOrdinate(data, series)).toBe(1.1548578);
  }));

  it('should return default margins for no series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
    ];

    var dimensions = {left: 10, right: 10};

    var options = {};
    n3utils.adjustMargins(dimensions, options, data);

    expect(dimensions).toEqual({left: 45, right: 50, top: 20, bottom: 30});
  }));

  it('should adjust margins for one left series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
    ];

    var dimensions = {left: 10, right: 10};

    var options = {series: [{y: 'value'}]};
    n3utils.adjustMargins(dimensions, options, data);
    expect(dimensions).toEqual(
      {left: 45, right: 50, top: 20, bottom: 30} // 50 is default
    );
  }));

  it('should adjust margins for two left series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
    ];

    var dimensions = {left: 10, right: 10};

    var options = {series: [{y: 'value'}, {y: 'foo'}]};
    n3utils.adjustMargins(dimensions, options, data);
    expect(dimensions).toEqual(
      {left: 80.30000000000001, right: 50, top: 20, bottom: 30}
    );
  }));

  it('should adjust margins for one left series and one right series', inject(function(n3utils) {
    var data = [
      {x: 0, foo: 4.154, value: 4},
      {x: 1, foo: 8.15485, value: 8},
      {x: 2, foo: 1.1548578, value: 15},
      {x: 3, foo: 1.154, value: 16},
      {x: 4, foo: 2.45, value: 23},
      {x: 5, foo: 4, value: 42}
    ];

    var dimensions = {left: 10, right: 10};

    var options = {series: [{y: 'value'}, {axis: 'y2', y: 'foo'}]};
    n3utils.adjustMargins(dimensions, options, data);
    expect(dimensions).toEqual(
      {left: 45, right: 80.30000000000001, top: 20, bottom: 30}
    );
  }));
});