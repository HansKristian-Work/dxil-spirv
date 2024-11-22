struct Foo
{
	float3 a : SV_CullDistance;
	float b : SV_ClipDistance;
};

struct Patch
{
	float c[3] : C;
	float d : D;
};

struct VOut
{
	float4 pos : SV_Position;
	float clip : SV_ClipDistance;
};

[domain("tri")]
VOut main(OutputPatch<Foo, 3> op, Patch p, float3 Coord : SV_DomainLocation)
{
	VOut vout;
	float pos = op[0].b * Coord.x + op[1].b * Coord.y + op[2].b * Coord.z;
	pos += op[0].a[2] * Coord.x + op[1].a[1] * Coord.y + op[2].a[0] * Coord.z;
	vout.pos = float4(pos, p.c[0] + p.c[1], p.c[2], p.d);
	vout.clip = 5.0;
	return vout;
}
