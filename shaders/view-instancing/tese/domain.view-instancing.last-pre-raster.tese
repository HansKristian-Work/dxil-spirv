struct Foo
{
	float a[3] : A;
	float b : B;
};

struct Patch
{
	float c[3] : C;
	float d : D;
};

[domain("tri")]
float4 main(OutputPatch<Foo, 3> op, Patch p, float3 Coord : SV_DomainLocation, uint vid : SV_ViewID) : SV_Position
{
	float pos = op[0].b * Coord.x + op[1].b * Coord.y + op[2].b * Coord.z + float(vid);
	pos += op[0].a[2] * Coord.x + op[1].a[1] * Coord.y + op[2].a[0] * Coord.z;
	return float4(pos, p.c[0] + p.c[1], p.c[2], p.d);
}
