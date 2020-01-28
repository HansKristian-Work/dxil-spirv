struct VSOut
{
	float4 pos : SV_Position;
	float clip : SV_ClipDistance;
};

VSOut main(float4 pos : POS, float clip : CLIP)
{
	VSOut vs;
	vs.pos = pos;
	vs.clip = clip.x;
	return vs;
}
