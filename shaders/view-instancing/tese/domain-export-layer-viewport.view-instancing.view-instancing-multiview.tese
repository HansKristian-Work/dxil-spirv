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

struct Output
{
	float4 pos : SV_Position;
	uint layer : SV_RenderTargetArrayIndex;
	uint vp : SV_ViewportArrayIndex;
};

[domain("tri")]
Output main(OutputPatch<Foo, 3> op, Patch p, float3 Coord : SV_DomainLocation, uint vid : SV_ViewID)
{
	Output o;
	o.pos = op[0].b * Coord.x + op[1].b * Coord.y + op[2].b * Coord.z + float(vid);
	o.pos += op[0].a[2] * Coord.x + op[1].a[1] * Coord.y + op[2].a[0] * Coord.z;
	o.layer = vid;
	o.vp = vid + 1;
	return o;
}
