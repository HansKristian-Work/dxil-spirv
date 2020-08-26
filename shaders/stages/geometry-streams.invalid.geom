struct Inputs
{
	float4 a : TEXCOORD;
	float4 pos : SV_Position;
};

struct Outputs0
{
	float4 a : A;
	float4 pos : SV_Position;
};

struct Outputs1
{
	float4 b : B;
};

struct Outputs2
{
	float4 c : C;
};

[maxvertexcount(3)]
void main(point Inputs input[1], inout PointStream<Outputs0> o0, inout PointStream<Outputs1> o1, inout PointStream<Outputs2> o2)
{
	Outputs0 res0;
	res0.a = input[0].a;
	res0.pos = input[0].pos;
	o0.Append(res0);

	Outputs1 res1;
	res1.b = input[0].a + 1.0;
	o1.Append(res1);

	Outputs2 res2;
	res2.c = input[0].a + 2.0;
	o2.Append(res2);
}
