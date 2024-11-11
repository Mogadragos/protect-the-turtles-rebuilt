import { PathData } from "../datas/levels";

export class Road {
    curves: PathData[];
    functions: ((T: number) => {
        x: number;
        y: number;
        out: boolean;
    })[];
    lastCurveIndex: number;

    constructor(curves: PathData[]) {
        this.curves = curves;
        this.lastCurveIndex = curves.length - 1;
        this.functions = [];
        this.calcFunctions();
    }
    calcFunctions() {
        for (const curve of this.curves) {
            this.functions.push(this.genCubicBezierXY(curve));
        }
    }
    genCubicBezierXY(curve: PathData) {
        const x = this.genCubicN(curve.x1, curve.x2, curve.x3, curve.x4);
        const y = this.genCubicN(curve.y1, curve.y2, curve.y3, curve.y4);
        return (T: number) => {
            return { x: x(T), y: y(T), out: false };
        };
    }
    genCubicN(a: number, b: number, c: number, d: number) {
        return (T: number) => {
            const t2 = T * T;
            const t3 = t2 * T;
            return (
                a +
                (-a * 3 + T * (3 * a - a * T)) * T +
                (3 * b + T * (-6 * b + b * 3 * T)) * T +
                (c * 3 - c * 3 * T) * t2 +
                d * t3
            );
        };
    }
    getPosition(T: number) {
        const index = Math.trunc(T);
        if (index < 0 || index > this.lastCurveIndex)
            return { x: -1, y: -1, out: true };
        return this.functions[index](T - index);
    }
}
