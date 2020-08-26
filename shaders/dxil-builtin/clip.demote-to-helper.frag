void main(float2 UV : TEXCOORD)
{
	clip(UV.x - 10.0);
	clip(UV.y - 20.0);
}
