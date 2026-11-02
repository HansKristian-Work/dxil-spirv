struct GSOut
{
	float4 pos : SV_Position;
	uint ff : SV_IsFrontFace;
};

struct GSIn
{
	float4 pos : SV_Position;
};

[maxvertexcount(1)]
void main(point GSIn p[1], inout PointStream<GSOut> stream)
{
	GSOut o;
	o.pos = p[0].pos;
	o.ff = 1;
	stream.Append(o);
}
