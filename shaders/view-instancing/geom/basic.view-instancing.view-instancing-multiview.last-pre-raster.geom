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

[maxvertexcount(2)]
void main(triangle Inputs input[3], inout PointStream<Outputs> o, uint vid : SV_ViewID)
{
	Outputs res;
	res.a = input[0].a + float(vid);
	res.pos = input[1].pos;
	o.Append(res);
	o.Append(res);
}
