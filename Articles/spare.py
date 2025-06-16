class Article_detail_APIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):
        print(pk)
        if pk:
            article = get_object_or_404(Article, pk=pk)
            html = extract_file_content(article.file)
            print(html)
            safe_html = bleach.clean(
                html,
                tags=[
                    "p", "br", "strong", "em", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "blockquote", "a"
                ],
                attributes={"a": ["href"]},
                strip=True,
            )

            return JsonResponse({"html": safe_html},status=200)