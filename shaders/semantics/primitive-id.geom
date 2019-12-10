struct Output
{
	float4 a : SV_Position;
	uint prim : SV_PrimitiveID;
};

struct Inputs
{
	float4 a : A;
};

[maxvertexcount(1)]
void main(point Inputs points[1], inout PointStream<Output> o, uint prim : SV_PrimitiveID)
{
	Output res;
	res.a = points[0].a;
	res.prim = prim + 1;
	o.Append(res);
}
