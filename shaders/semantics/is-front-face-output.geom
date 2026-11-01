struct GSOut
{
	float4 pos : SV_Position;
	uint ff : SV_IsFrontFace;
};

[maxvertexcount(1)]
void main(point float4 p[1] : SV_Position, inout PointStream<GSOut> stream)
{
	GSOut o;
	o.pos = p[0];
	o.ff = 1;
	stream.Append(o);
}
