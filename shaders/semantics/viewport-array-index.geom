struct Output
{
	float4 a : SV_Position;
	uint layer : SV_ViewportArrayIndex;
};

struct Inputs
{
	float4 a : A;
	float4 b : B;
};

[maxvertexcount(2)]
void main(point Inputs points[1], inout PointStream<Output> o)
{
	Output res;
	res.a = points[0].a;
	res.layer = 0;
	o.Append(res);
	res.a = points[0].b;
	res.layer = 1;
	o.Append(res);
}
