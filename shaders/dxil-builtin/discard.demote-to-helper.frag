void main(float2 UV : TEXCOORD)
{
	if (UV.x > 10.0)
		discard;
	else if (UV.y > 20.0)
		discard;
}
