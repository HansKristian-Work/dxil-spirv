struct Inputs
{
	float4 a : TEXCOORD;
	float4 pos : SV_Position;
};

struct Outputs
{
	float4 a : TEXCOORD;
	float4 pos : SV_Position;
};

[maxvertexcount(6)]
void main(lineadj Inputs input[4], inout TriangleStream<Outputs> o)
{
	Outputs res;
	res.a = input[0].a;
	res.pos = input[3].pos;
	o.Append(res);
	res.pos.x += 0.01;
	o.Append(res);
	res.pos.x += 0.01;
	o.Append(res);
	o.RestartStrip();

	o.Append(res);
	o.Append(res);
	o.Append(res);
}
