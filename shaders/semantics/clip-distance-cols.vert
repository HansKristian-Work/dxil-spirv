struct VSOut
{
	float4 pos : SV_Position;
	float2 clip : SV_ClipDistance;
};

VSOut main(float4 pos : POS, float2 clip : CLIP)
{
	VSOut vs;
	vs.pos = pos;
	vs.clip[0] = clip.x;
	vs.clip[1] = clip.y;
	return vs;
}
