float main(bool front : SV_IsFrontFace) : SV_Target
{
	return front ? 1.0 : 0.0;
}
