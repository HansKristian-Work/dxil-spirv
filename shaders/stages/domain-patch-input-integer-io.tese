struct Foo
{
	float a : A;
};

struct Patch
{
	int b : B;
	uint c : C;
	int4 bv : BV;
	uint4 cv : CV;
	int bvs[2] : BVS;
	uint cvs[2] : CVS;
	int4 bvss[2] : BVSS;
	uint4 cvss[2] : CVSS;
};

[domain("tri")]
float4 main(OutputPatch<Foo, 3> op, Patch p, float3 Coord : SV_DomainLocation) : SV_Position
{
	return float4(op[0].a, float(p.b), float(p.c), 1.0) +
		float4(p.bv) +
		float4(p.cv) +
		float(p.bvs[0]) +
		float(p.cvs[1]) +
		float4(p.bvss[0]) +
		float4(p.cvss[1]);
}
