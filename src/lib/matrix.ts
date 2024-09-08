export class Matrix3 {
    private matrix: Array<Array<number>>;

    public constructor (matrix: Array<Array<number>>) {
        this.matrix = matrix;
    }

    get m11() {
        return this.matrix[0][0];
    }

    set m11(value: number) {
        this.matrix[0][0] = value;
    }

    get m12() {
        return this.matrix[0][1];
    }

    set m12(value: number) {
        this.matrix[0][1] = value;
    }

    get m13() {
        return this.matrix[0][2];
    }

    set m13(value: number) {
        this.matrix[0][2] = value;
    }

    get m21() {
        return this.matrix[1][0];
    }

    set m21(value: number) {
        this.matrix[1][0] = value;
    }

    get m22() {
        return this.matrix[1][1];
    }

    set m22(value: number) {
        this.matrix[1][1] = value;
    }

    get m23() {
        return this.matrix[1][2];
    }

    set m23(value: number) {
        this.matrix[1][2] = value;
    }

    get m31() {
        return this.matrix[2][0];
    }

    set m31(value: number) {
        this.matrix[2][0] = value;
    }

    get m32() {
        return this.matrix[2][1];
    }

    set m32(value: number) {
        this.matrix[2][1] = value;
    }

    get m33() {
        return this.matrix[2][2];
    }

    set m33(value: number) {
        this.matrix[2][2] = value;
    }

    public clone(): Matrix3 {
        let val = new Matrix3([
            [this.m11, this.m12, this.m13],
            [this.m21, this.m22, this.m23],
            [this.m31, this.m32, this.m33]
        ]);

        return val;
    }

    public multiply(other: Matrix3): Matrix3 {
        let m11 = this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31;
        let m12 = this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32;
        let m13 = this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33;

        let m21 = this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31;
        let m22 = this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32;
        let m23 = this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33;

        let m31 = this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31;
        let m32 = this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32;
        let m33 = this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33;

        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;

        return this;
    }

    public multiplied(other: Matrix3): Matrix3 {
        return this.clone().multiply(other);
    }
}