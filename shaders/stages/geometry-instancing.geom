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
[instance(2)]
void main(triangle Inputs input[3], inout TriangleStream<Outputs> o, uint InstanceID : SV_GSInstanceID)
{
	Outputs res;
	res.a = input[InstanceID].a;
	res.pos = input[InstanceID ^ 1].pos;
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
