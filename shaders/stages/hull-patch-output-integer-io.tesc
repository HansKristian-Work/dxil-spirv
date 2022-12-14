struct Foo
{
	int a : A;
	uint b : B;
};

struct PatchConstant
{
	float outer[3] : SV_TessFactor;
	float inner[1] : SV_InsideTessFactor;
	int b : B;
	uint c : C;
	int4 bv : BV;
	uint4 cv : CV;
	int bvs[2] : BVS;
	uint cvs[2] : CVS;
	int4 bvss[2] : BVSS;
	uint4 cvss[2] : CVSS;
};

struct HSControlPoint
{
	float a : A;
};

[domain("tri")]
[partitioning("integer")]
[outputtopology("triangle_ccw")]
[outputcontrolpoints(3)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<Foo, 2> ip)
{
	HSControlPoint cp;
	cp.a = float(ip[0].a) + float(ip[1].b);
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 3> op, InputPatch<Foo, 2> ip)
{
	PatchConstant pc;
	pc.inner[0] = op[0].a + op[1].a;
	pc.outer[0] = float(ip[0].a);
	pc.outer[1] = float(ip[1].b);
	pc.outer[2] = 4.0;

	pc.b = 10;
	pc.c = 20;
	pc.bv = int4(1, 2, 3, 4);
	pc.cv = uint4(5, 6, 7, 8);
	pc.bvs[0] = 50;
	pc.bvs[1] = 60;
	pc.cvs[0] = 70;
	pc.cvs[1] = 80;
	pc.bvss[0] = int4(50, 60, 70, 80);
	pc.bvss[1] = int4(51, 52, 53, 54);
	pc.cvss[0] = int4(70, 71, 72, 73);
	pc.cvss[1] = uint4(80, 81, 82, 83);
	return pc;
}
