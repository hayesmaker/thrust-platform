var _ = require('lodash');
/**
 * A module for creating common canvas drawing based drawings
 * Used heavily inside {meterPanel}
 *
 * @class canvas
 * @namespace utils
 * @static
 */
module.exports = {
  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * By passing a 4 numbered Array as [cornerRadii] you may create a rectangle with individually rounded corners
   * If you omit the last three params, it will draw a rectangle outline with corner radii equal to radius param
   * Influenced by StackOverflow: http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
   *
   * @method drawRoundRect
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} radius of all corner radii if [cornerRadii] is not set for all 4 cornerRadii
   * @param {Boolean} [fill] Whether to fill the rectangle. Defaults to false.
   * @param {Boolean} [stroke] Whether to stroke the rectangle. Defaults to true.
   * @param {Array} [cornerRadii] optionally independently effect the radius of a corner pass array with radius starting from [upperLeft, upperRight, lowerLeft, lowerRight]
   * @returns {CanvasRenderingContext2D} ctx for daisy chaining
   */
  drawRoundRect: function(ctx, x, y, width, height, radius, fill, stroke, cornerRadii) {
    if (!cornerRadii) {
      cornerRadii = [radius, radius, radius, radius];
    }
    
    ctx.moveTo(x + cornerRadii[0], y);
    ctx.lineTo(x + width - cornerRadii[1], y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadii[1]);
    ctx.lineTo(x + width, y + height - cornerRadii[3]);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadii[3], y + height);
    ctx.lineTo(x + cornerRadii[2], y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadii[2]);
    ctx.lineTo(x, y + cornerRadii[0]);
    ctx.quadraticCurveTo(x, y, x + cornerRadii[0], y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
    return ctx;
  },

  /**
   * @method drawCircle
   * @param context
   * @param x
   * @param y
   * @param radius
   */
  drawCircle: function(context, x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fill();
    context.closePath();
    context.stroke();
  },

  /**
   * Draws a rounded rectangle with an optional pointer.
   * @param context
   * @param x
   * @param y
   * @param width
   * @param height
   * @param radius
   * @param pointer
   */
  drawRoundedRectangleWithPointer: function(context, x, y, width, height, radius, pointer) {
    context.moveTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y); // top-left corner
    this.drawSide(context, x + radius, y, x + width - radius, y, pointer.side === "N", -1 * pointer.size, pointer.basePosition, pointer.baseWidth); // top side
    context.quadraticCurveTo(x + width, y, x + width, y + radius); // top-right corner
    this.drawSide(context, x + width, y + radius, x + width, y + height - radius, pointer.side === "E", pointer.size, pointer.basePosition, pointer.baseWidth); // right side
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // bottom-right corner
    this.drawSide(context, x + width - radius, y + height, x + radius, y + height, pointer.side === "S", pointer.size, pointer.basePosition, pointer.baseWidth); // bottom side
    context.quadraticCurveTo(x, y + height, x, y + height - radius); // bottom-left corner
    this.drawSide(context, x, y + height - radius, x, y + radius, pointer.side === "W", -1 * pointer.size, pointer.basePosition, pointer.baseWidth); // left side
  },

  /**
   * Draws a line with optional pointer.
   * @param context
   * @param startX
   * @param startY
   * @param endX
   * @param endY
   * @param hasPointer
   * @param size
   * @param basePosition
   * @param baseWidth
   */
  drawSide: function(context, startX, startY, endX, endY, hasPointer, size, basePosition, baseWidth) {
    if (hasPointer) {
      this.drawPointer(context, startX, startY, endX, endY, size, basePosition, baseWidth);

    }
    context.lineTo(endX, endY);
  },

  /**
   * Draws a pointer.
   * @param context
   * @param startX
   * @param startY
   * @param endX
   * @param endY
   * @param size
   * @param basePosition
   * @param baseWidth
   */
  drawPointer: function(context, startX, startY, endX, endY, size, basePosition, baseWidth) {
    var points = [
      { x: startX, y: startY },
      { x: startX, y: startY },
      { x: startX, y: startY }
    ];
    // Vars dependent on axis of side the pointer is drawn on
    var axis = (startX !== endX) ? 'x' : 'y';
    var otherAxis = (axis === 'x') ? 'y' : 'x';
    var start = (axis === 'x') ? startX : startY;
    var end = (axis === 'x') ? endX : endY;

    var lengthOfSide = end - start;
    var drawingDirection = lengthOfSide > 0 ? 1 : -1;
    var position = basePosition * lengthOfSide;

    baseWidth = Math.min(Math.abs(lengthOfSide), baseWidth);

    var clamp = (drawingDirection === 1) ? Math.max : Math.min;
    // clamped to stop the pointer being drawn beyond the start of the side
    points[0][axis] = clamp(start, start + position + -1 * drawingDirection * baseWidth * 0.5);
    points[1][axis] = start + position;
    points[1][otherAxis] += size;
    points[2][axis] = start + position + drawingDirection * baseWidth * 0.5;

    _.each(points, function(point) {
      context.lineTo(point.x, point.y);
    });
  },

  /**
   * Draws the spin arrow icon.
   * @param context {CanvasRenderingContext2D} The context in which to draw the icon.
   * @param centerPoint {object} Center point around which the icon is drawn
   * @param centerPoint.x {number} X-axis of centerPoint
   * @param centerPoint.y {number} Y-axis of centerPoint
   * @param radius {number} Radius of the circle part of the icon
   * @param lineWidth {number} Line width of the icon
   */
  drawSpinArrow: function(context, centerPoint, radius, lineWidth) {
    var colour = "rgba(255, 255, 255, 1)";
    var start = Math.PI * 0.15;
    var end = Math.PI * 1.75;

    context.fillStyle = colour;
    context.strokeStyle = colour;
    context.lineWidth = lineWidth;

    // draw partial arc
    context.beginPath();
    context.arc(centerPoint.x, centerPoint.y, radius, start, end, false);
    context.stroke();

    // draw arrow head
    context.beginPath();
    context.lineWidth = 1;
    this.drawPolygon(context, this.getPointsForArrowHead(centerPoint, radius, lineWidth, end));
    context.closePath();
    context.stroke();
    context.fill();
  },
  /**
   * Calculates points for the arrow head part of the icon based on end point and size of circle.
   * @param centerPoint {object} Center point around which the icon is drawn
   * @param centerPoint.x {number} X-axis of centerPoint
   * @param centerPoint.y {number} Y-axis of centerPoint
   * @param radius {number} Radius of the circle part of the icon
   * @param lineWidth {number} Line width of the icon
   * @param end {number} End point of the circle part of the icon
   * @returns {array} Array of points that form the path of the arrow head shape.
   */
  getPointsForArrowHead: function(centerPoint, radius, lineWidth, end) {
    var cosEnd = Math.cos(end);
    var sinEnd = Math.sin(end);
    var radiusAndStroke = radius + lineWidth;
    var doubleLineWidth = lineWidth * 2;
    var points = [];
    var point = {
      x: centerPoint.x + cosEnd * radius,
      y: centerPoint.y + sinEnd * radius
    };
    points.push(point);
    point = {
      x: centerPoint.x + cosEnd * radiusAndStroke,
      y: centerPoint.y + sinEnd * radiusAndStroke
    };
    points.push(point);
    point = {
      x: points[0].x+(Math.cos(end+Math.PI*0.5)*doubleLineWidth),
      y: points[0].y+(Math.sin(end+Math.PI*0.5)*doubleLineWidth)
    };
    points.push(point);
    point = {
      x: centerPoint.x + cosEnd * (radius-lineWidth),
      y: centerPoint.y + sinEnd * (radius-lineWidth)
    };
    points.push(point);
    return points;
  },
  /**
   * Draws a polygon from a set of points.
   * @param context {CanvasRenderingContext2D} The context in which to draw the ploygon.
   * @param points {array} An array of points that form the polygon.
   */
  drawPolygon: function(context, points) {
    var firstPosition = _.first(points);
    context.moveTo(firstPosition.x, firstPosition.y);
    _.each(points, function(position) {
      context.lineTo(position.x, position.y);
    });
  },

  drawCross: function(context, x, y, width, height, lineWidth, strokeStyle) {
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(x-width*0.5, y-height*0.5);
    context.lineTo(x+width*0.5, y+height*0.5);
    context.moveTo(x-width*0.5, y+height*0.5);
    context.lineTo(x+width*0.5, y-height*0.5);
    context.closePath();
    context.stroke();
  },

  drawEmbossedCircle: function(context, x, y, innerRadius, outerRadius) {
    context.lineWidth = 0;
    context.strokeStyle = null;

    var point0 = {
      x: x - innerRadius,
      y: y + innerRadius
    };
    var point1 = {
      x: x + innerRadius,
      y: y - innerRadius
    };

    var metalGradient = context.createLinearGradient(
      point0.x, point0.y,
      point1.x, point1.y
    );
    metalGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    metalGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    metalGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

    context.fillStyle = '#2b2b2b';
    context.beginPath();
    context.arc(x, y, outerRadius, 0, Math.PI*2);
    context.fill();
    context.closePath();

    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(x, y, innerRadius, 0, Math.PI*2);
    context.fill();
    context.closePath();

    context.fillStyle = metalGradient;
    context.beginPath();
    context.arc(x, y, innerRadius, 0, Math.PI*2);
    context.fill();
    context.closePath();
  },

  /**
   * Makes beginning a path while drawing in canvas more concise.
   * @method start
   * @param context
   * @param options {object} - beginPath
   */
  start: function(context, options) {
    _.each(options, function(option, key) {
      if(key in context) {
        if(typeof context[key] === 'function') {
          if(option) { context[key](); }
        } else {
          context[key] = option;
        }
      }
    });
  },
  /**
   * Makes closing a path while drawing in canvas more concise.
   * @method end
   * @param context
   * @param options {object} - closePath, stroke, fill.
   */
  end: function(context, options) {
    if(options.closePath) { context.closePath(); }
    if(options.stroke) { context.stroke(); }
    if(options.fill) { context.fill(); }
  }
};
