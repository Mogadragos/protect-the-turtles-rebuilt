import { PathData } from "../datas/levels";

type Point = { x: number; y: number };
type PointWithAngle = Point & { angle: number };

function slicer(
    ctx: CanvasRenderingContext2D,
    points: PointWithAngle[],
    img: HTMLImageElement
) {
    // Note: increase the lineWidth if
    // the gradient has noticable gaps
    ctx.lineWidth = 2;

    ctx.strokeStyle = "skyblue";

    var sliceCount = 0;

    // draw a gradient-stroked line tangent to each point on the curve
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle - Math.PI / 2);
        // draw multiple times to fill gaps on outside of rope slices
        ctx.drawImage(
            img,
            sliceCount,
            0,
            1,
            img.height,
            0,
            -img.height / 2,
            1,
            img.height
        );
        ctx.drawImage(
            img,
            sliceCount,
            0,
            1,
            img.height,
            0,
            -img.height / 2,
            1,
            img.height
        );
        ctx.drawImage(
            img,
            sliceCount,
            0,
            1,
            img.height,
            0,
            -img.height / 2,
            1,
            img.height
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ++sliceCount;
        if (sliceCount > img.width - 1) {
            sliceCount = 0;
        }
    }
}

//////////////////////////////////////////
// helper functions
//////////////////////////////////////////

// calculate one XY point along Cubic Bezier at interval T
// (where T==0.00 at the start of the curve and T==1.00 at the end)
function getCubicBezierXYatT(
    startPt: Point,
    controlPt1: Point,
    controlPt2: Point,
    endPt: Point,
    T: number
) {
    var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return { x: x, y: y };
}

// cubic helper formula at T distance
function CubicN(T: number, a: number, b: number, c: number, d: number) {
    var t2 = T * T;
    var t3 = t2 * T;
    return (
        a +
        (-a * 3 + T * (3 * a - a * T)) * T +
        (3 * b + T * (-6 * b + b * 3 * T)) * T +
        (c * 3 - c * 3 * T) * t2 +
        d * t3
    );
}

// calculate the tangent angle at interval T on the curve
function bezierTangent(a: number, b: number, c: number, d: number, t: number) {
    return (
        3 * t * t * (-a + 3 * b - 3 * c + d) +
        6 * t * (a - 2 * b + c) +
        3 * (-a + b)
    );
}

export function DrawPath(
    ctx: CanvasRenderingContext2D,
    curve: PathData,
    url: string
) {
    // variables defining a cubic bezier curve

    var s = { x: curve.x1, y: curve.y1 };
    var c1 = { x: curve.x2, y: curve.y2 };
    var c2 = { x: curve.x3, y: curve.y3 };
    var e = { x: curve.x4, y: curve.y4 };

    // an array of points plotted along the bezier curve
    var points: PointWithAngle[] = [];

    // we use PI often so put it in a variable
    var PI = Math.PI;

    // plot 400 points along the curve
    // and also calculate the angle of the curve at that point
    // NOTE: You may need to adjust the point count (==100 here)
    //      if the curve is much shorter or longer than this demo's curve
    for (var t = 0; t <= 400; t += 0.25) {
        var T = t / 400;

        // plot a point on the curve
        var pos = getCubicBezierXYatT(s, c1, c2, e, T);

        // calculate the tangent angle of the curve at that point
        var tx = bezierTangent(s.x, c1.x, c2.x, e.x, T);
        var ty = bezierTangent(s.y, c1.y, c2.y, e.y, T);
        var a = Math.atan2(ty, tx) - PI / 2;

        // save the x/y position of the point and the tangent angle
        // in the points array
        points.push({
            x: pos.x,
            y: pos.y,
            angle: a,
        });
    }

    var img = new Image();
    img.onload = function () {
        slicer(ctx, points, img);
    };
    img.src = url;
}
